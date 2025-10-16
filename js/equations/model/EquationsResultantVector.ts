// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsResultantVector is the resultant vector in the 'Equations' screen.  The resultant vector is computed
 * differently depending on the selected equation type.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import { EquationType } from './EquationType.js';
import VectorSet from '../../common/model/VectorSet.js';
import ResultantVector, { ResultantVectorOptions } from '../../common/model/ResultantVector.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Graph from '../../common/model/Graph.js';
import Property from '../../../../axon/js/Property.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type EquationsResultantVectorOptions = SelfOptions & StrictOmit<ResultantVectorOptions, 'isDefinedPropertyInstrumented'>;

export default class EquationsResultantVector extends ResultantVector {

  private readonly equationTypeProperty: TReadOnlyProperty<EquationType>;

  public constructor( tailPosition: Vector2,
                      vectorSet: VectorSet,
                      graph: Graph,
                      selectedVectorProperty: Property<Vector | null>,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      equationTypeProperty: TReadOnlyProperty<EquationType>,
                      providedOptions: EquationsResultantVectorOptions ) {

    const options = optionize<EquationsResultantVectorOptions, SelfOptions, ResultantVectorOptions>()( {

      // ResultantVectorOptions
      isDefinedPropertyInstrumented: false // because there are always vectors on the graph in the Equations screen
    }, providedOptions );

    super( tailPosition, Vector2.ZERO, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    this.equationTypeProperty = equationTypeProperty;

    // When the equation type changes, update the result.
    equationTypeProperty.lazyLink( () => this.update( vectorSet.activeVectors ) );

    // When any vector's xy-components change, update the result.
    const vectorAddedListener = ( vector: Vector ) => vector.xyComponentsProperty.link( () => this.update( vectorSet.activeVectors ) );
    vectorSet.activeVectors.forEach( vector => vectorAddedListener( vector ) );
    vectorSet.activeVectors.addItemAddedListener( vectorAddedListener );
  }

  /**
   * WORKAROUND: xyComponentsProperty was initialized with a bogus value of Vector2.ZERO in the
   * call to the superclass constructor above. So call updateSum after calling super.reset.
   * See https://github.com/phetsims/vector-addition/issues/328.
   */
  public override reset(): void {
    super.reset();
    this.update( this.vectorSet.activeVectors );
  }

  /**
   * Calculate the resultant vector, depending on which equation type is selected.
   */
  private update( vectors: ObservableArray<Vector> ): void {

    const equationType = this.equationTypeProperty.value;

    // Denoted by 'a' + 'b' = 'c'
    if ( equationType === 'addition' ) {
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.xyComponents );
      } );

      this.xyComponentsProperty.value = sum;
    }
    else if ( equationType === 'subtraction' ) {
      const calculatedComponents = vectors.get( 0 ).xyComponents.copy();

      // Subtract from the first vector
      _.drop( vectors ).forEach( vector => {
        calculatedComponents.subtract( vector.xyComponents );
      } );

      this.xyComponentsProperty.value = calculatedComponents;
    }
    else if ( equationType === 'negation' ) {

      // Same as addition but negated: a + b = -c or a + b + c = 0
      const sum = new Vector2( 0, 0 );

      vectors.forEach( vector => {
        sum.add( vector.xyComponents );
      } );

      this.xyComponentsProperty.value = sum.negate();
    }
  }
}

vectorAddition.register( 'EquationsResultantVector', EquationsResultantVector );