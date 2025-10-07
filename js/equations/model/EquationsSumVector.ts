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
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import { EquationType } from './EquationType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorSet from '../../common/model/VectorSet.js';
import EquationsScene from './EquationsScene.js';
import ResultantVector from '../../common/model/ResultantVector.js';

export default class EquationsSumVector extends ResultantVector {

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
      isDisposable: false, // Resultant vectors are not disposable.
      isRemovableFromGraph: false, // Resultant vectors are not removable from the graph.
      isTipDraggable: false, // Resultant vectors are not draggable by the tip.
      isOnGraphInitially: true, // Resultant vectors are always on the graph.
      isOnGraphPropertyInstrumented: false, // Resultant vectors are always on the graph.
      tandemNameSymbol: tandemNameSymbol,
      tandem: tandem
    } );

    this.equationTypeProperty = scene.equationTypeProperty;

    // Observe when each vector changes and/or when the equationType changes to calculate the sum.
    const xyComponentsProperties = vectorSet.vectors.map( vector => vector.xyComponentsProperty );
    Multilink.multilinkAny( [ scene.equationTypeProperty, ...xyComponentsProperties ],
      () => this.updateSum( vectorSet.vectors )
    );
  }

  /**
   * WORKAROUND: xyComponentsProperty was initialized with a bogus value of Vector2.ZERO in the
   * call to the superclass constructor above. So call updateSum after calling super.reset.
   * See https://github.com/phetsims/vector-addition/issues/328.
   */
  public override reset(): void {
    super.reset();
    this.updateSum( this.vectorSet.vectors );
  }

  /**
   * Calculate the sum vector for the Equations screen.
   */
  private updateSum( vectors: ObservableArray<Vector> ): void {

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

vectorAddition.register( 'EquationsSumVector', EquationsSumVector );