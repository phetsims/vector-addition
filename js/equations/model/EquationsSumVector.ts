// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsSumVector is a specialization of SumVector for the 'Equations' screen.  It computes the 'sum' differently
 * depending on the equation type.  Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionScene from '../../common/model/VectorAdditionScene.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';
import SumVector from '../../common/model/SumVector.js';
import Vector from '../../common/model/Vector.js';
import VectorSet from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import { EquationType } from './EquationType.js';

// constants
const EQUATIONS_SUM_TAIL_POSITION = new Vector2( 25, 5 );

export default class EquationsSumVector extends SumVector {

  private readonly equationTypeProperty: TReadOnlyProperty<EquationType>;

  /**
   * @param graph - graph the sum vector belongs to
   * @param vectorSet - the vector set that the sum vector represents
   * @param equationTypeProperty
   * @param symbolProperty - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   */
  public constructor( graph: VectorAdditionScene,
                      vectorSet: VectorSet,
                      equationTypeProperty: TReadOnlyProperty<EquationType>,
                      symbolProperty: TReadOnlyProperty<string> ) {

    super( EQUATIONS_SUM_TAIL_POSITION, graph, vectorSet, symbolProperty );

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
    if ( equationType === 'addition' ) {
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.vectorComponents );
      } );

      this.vectorComponents = sum;
    }
    else if ( equationType === 'subtraction' ) {
      const calculatedComponents = vectors.get( 0 ).vectorComponents.copy();

      // Subtract from the first vector
      _.drop( vectors ).forEach( vector => {
        calculatedComponents.subtract( vector.vectorComponents );
      } );

      this.vectorComponents = calculatedComponents;
    }
    else if ( equationType === 'negation' ) {

      // Same as addition but negated: a + b = -c or a + b + c = 0
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
    return combineOptions<LabelDisplayData>( super.getLabelDisplayData( valuesVisible ), {
      symbolProperty: this.symbolProperty
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