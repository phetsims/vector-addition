// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsSumVector is a specialization of SumVector for the 'Equations' screen.  It computes the 'sum' differently
 * depending on the equation type.  Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import SumVector from '../../common/model/SumVector.js';
import vectorAddition from '../../vectorAddition.js';
import EquationTypes from './EquationTypes.js';
import VectorSet from '../../common/model/VectorSet.js';
import Graph from '../../common/model/Graph.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Vector from '../../common/model/Vector.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';

// constants
const EQUATIONS_SUM_TAIL_POSITION = new Vector2( 25, 5 );

export default class EquationsSumVector extends SumVector {

  private readonly equationTypeProperty: EnumerationProperty<EquationTypes>;

  /**
   * @param graph - graph the sum vector belongs to
   * @param vectorSet - the vector set that the sum vector represents
   * @param equationTypeProperty
   * @param symbol - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   */
  public constructor( graph: Graph, vectorSet: VectorSet, equationTypeProperty: EnumerationProperty<EquationTypes>,
                      symbol: string | null ) {

    super( EQUATIONS_SUM_TAIL_POSITION, graph, vectorSet, symbol );

    this.equationTypeProperty = equationTypeProperty;

    // Observe when each vector changes and/or when the equationType changes to calculate the sum.
    // unmultilink is unnecessary, exists for the lifetime of the sim.
    const vectorComponentsProperties = vectorSet.vectors.map( vector => vector.vectorComponentsProperty );
    Multilink.multilinkAny( [ equationTypeProperty, ...vectorComponentsProperties ],
      () => this.updateSum( vectorSet.vectors )
    );
  }

  /**
   * Calculate the sum vector for the Equations screen.
   */
  public override updateSum( vectors: ObservableArray<Vector> ): void {

    const equationType = this.equationTypeProperty.value;

    // Denoted by 'a' + 'b' = 'c'
    if ( equationType === EquationTypes.ADDITION ) {
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.vectorComponents );
      } );

      this.vectorComponents = sum;
    }
    else if ( equationType === EquationTypes.SUBTRACTION ) {
      const calculatedComponents = vectors.get( 0 ).vectorComponents.copy();

      // Subtract from the first vector
      _.drop( vectors ).forEach( vector => {
        calculatedComponents.subtract( vector.vectorComponents );
      } );

      this.vectorComponents = calculatedComponents;
    }
    else if ( equationType === EquationTypes.NEGATION ) {

      // Same as addition but negated  : a + b = -c or a + b + c = 0
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.vectorComponents );
      } );

      this.vectorComponents = sum.negate();
    }
  }

  /**
   * See RootVector.getLabelDisplayData for details.
   */
  public override getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {
    return merge( super.getLabelDisplayData( valuesVisible ), {
      symbol: this.symbol
    } );
  }

  public override reset(): void {
    super.reset();

    // In the Equations screen, vectors are never removed, so we need to explicitly call updateSum.
    // See https://github.com/phetsims/vector-addition/issues/129
    this.updateSum( this.vectorSet.vectors );
  }
}

vectorAddition.register( 'EquationsSumVector', EquationsSumVector );