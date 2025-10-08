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
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorSet from '../../common/model/VectorSet.js';
import EquationsScene from './EquationsScene.js';
import ResultantVector from '../../common/model/ResultantVector.js';

export default class EquationsResultantVector extends ResultantVector {

  private readonly equationTypeProperty: TReadOnlyProperty<EquationType>;

  /**
   * @param initialTailPosition - starting tail position of the vector
   * @param scene - scene the sum vector belongs to
   * @param vectorSet - the vector set that the sum vector represents
   * @param symbolProperty - the symbol for the vector (i.e. 'a', 'b', 'c', ...)
   * @param tandemNameSymbol - symbol for the vector used in tandem names
   * @param tandem
   */
  public constructor( initialTailPosition: Vector2,
                      scene: EquationsScene,
                      vectorSet: VectorSet,
                      symbolProperty: TReadOnlyProperty<string>,
                      tandemNameSymbol: string,
                      tandem: Tandem ) {

    super( initialTailPosition, Vector2.ZERO, scene, vectorSet, symbolProperty, {
      tandemNameSymbol: tandemNameSymbol,
      tandem: tandem
    } );

    this.equationTypeProperty = scene.equationTypeProperty;

    // When the equation type changes, update the result.
    scene.equationTypeProperty.lazyLink( () => this.update( vectorSet.vectors ) );

    // When any vector's xy-components change, update the result.
    const vectorAddedListener = ( vector: Vector ) => vector.xyComponentsProperty.link( () => this.update( vectorSet.vectors ) );
    vectorSet.vectors.forEach( vector => vectorAddedListener( vector ) );
    vectorSet.vectors.addItemAddedListener( vectorAddedListener );

    //TODO https://github.com/phetsims/vector-addition/issues/334 ResultantVector should be responsible for updating isDefinedProperty.
    this.isDefinedProperty.value = true;
  }

  /**
   * WORKAROUND: xyComponentsProperty was initialized with a bogus value of Vector2.ZERO in the
   * call to the superclass constructor above. So call updateSum after calling super.reset.
   * See https://github.com/phetsims/vector-addition/issues/328.
   */
  public override reset(): void {
    super.reset();
    this.update( this.vectorSet.vectors );
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